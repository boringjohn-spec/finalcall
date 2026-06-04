use display_info::DisplayInfo;
use mouse_position::mouse_position::Mouse;
use serde::Serialize;
use serde_json::Value;
use tauri::{AppHandle, Manager, WebviewUrl, WebviewWindowBuilder};
use tauri::image::Image;
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri_plugin_positioner::{Position, WindowExt};


const OVERLAY_DURATION_MS: u64 = 17_250;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct DisplayBounds {
    id: String,
    name: String,
    x: i32,
    y: i32,
    width: u32,
    height: u32,
    scale_factor: f64,
}

#[derive(Serialize)]
struct CursorPosition {
    x: i32,
    y: i32,
}

#[derive(Serialize)]
struct DisplaySnapshot {
    cursor: CursorPosition,
    displays: Vec<DisplayBounds>,
}

#[tauri::command]
fn get_display_snapshot() -> Result<DisplaySnapshot, String> {
    let cursor = match Mouse::get_mouse_position() {
        Mouse::Position { x, y } => CursorPosition { x, y },
        Mouse::Error => return Err("Unable to read cursor position.".to_string()),
    };

    let displays = DisplayInfo::all()
        .map_err(|error| format!("Unable to read display information: {error}"))?
        .into_iter()
        .map(|display| DisplayBounds {
            id: display.id.to_string(),
            name: display.name,
            x: display.x,
            y: display.y,
            width: display.width,
            height: display.height,
            scale_factor: display.scale_factor as f64,
        })
        .collect();

    Ok(DisplaySnapshot { cursor, displays })
}

#[tauri::command]
fn show_reminder_overlay(app: AppHandle, reminder: Value) -> Result<(), String> {
    let target_display = reminder
        .get("target")
        .and_then(|target| target.get("display"))
        .ok_or_else(|| "Reminder target display is missing.".to_string())?;

    let x = target_display
        .get("x")
        .and_then(Value::as_i64)
        .ok_or_else(|| "Target display x is missing.".to_string())? as f64;
    let y = target_display
        .get("y")
        .and_then(Value::as_i64)
        .ok_or_else(|| "Target display y is missing.".to_string())? as f64;
    let width = target_display
        .get("width")
        .and_then(Value::as_u64)
        .ok_or_else(|| "Target display width is missing.".to_string())? as f64;
    let height = target_display
        .get("height")
        .and_then(Value::as_u64)
        .ok_or_else(|| "Target display height is missing.".to_string())? as f64;

    let label = format!(
        "reminder-overlay-{}",
        reminder
            .get("id")
            .and_then(Value::as_str)
            .unwrap_or("current")
            .replace(|character: char| !character.is_ascii_alphanumeric(), "-")
    );

    if let Some(existing_window) = app.get_webview_window(&label) {
        let _ = existing_window.close();
    }

    let payload = serde_json::to_string(&reminder)
        .map_err(|error| format!("Unable to serialize reminder payload: {error}"))?;
    let route = format!("index.html#/overlay?payload={}", percent_encode(&payload));

    let window = WebviewWindowBuilder::new(&app, label.clone(), WebviewUrl::App(route.into()))
        .title("FinalCall Reminder")
        .decorations(false)
        .transparent(true)
        .always_on_top(true)
        .skip_taskbar(true)
        .resizable(false)
        .shadow(false)
        .position(x, y)
        .inner_size(width, height)
        .build()
        .map_err(|error| format!("Unable to create reminder overlay: {error}"))?;

    let _ = window.set_ignore_cursor_events(true);

    tauri::async_runtime::spawn(async move {
        tokio::time::sleep(std::time::Duration::from_millis(OVERLAY_DURATION_MS)).await;
        if let Some(window) = app.get_webview_window(&label) {
            let _ = window.close();
        }
    });

    Ok(())
}

fn percent_encode(input: &str) -> String {
    input
        .bytes()
        .flat_map(|byte| match byte {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => {
                vec![byte as char]
            }
            _ => format!("%{byte:02X}").chars().collect(),
        })
        .collect()
}

#[tauri::command]
fn quit_app(app: AppHandle) {
    app.exit(0);
}

#[tauri::command]
fn hide_window(app: AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.hide();
    }
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_positioner::init())
        .setup(|app| {
            #[cfg(target_os = "macos")]
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);

            // Load the tray icon
            let tray_icon = Image::from_bytes(include_bytes!("../icons/trayTemplate.png"))
                .expect("Failed to load tray icon");

            let app_handle = app.handle().clone();

            // Build the tray icon — toggle window on left click
            let app_handle_for_tray = app_handle.clone();
            let _tray = TrayIconBuilder::new()
                .icon(tray_icon)
                .on_tray_icon_event(move |_tray, event| {
                    tauri_plugin_positioner::on_tray_event(&app_handle_for_tray, &event);

                    // Only act on mouse-UP — the Click event fires on both
                    // press and release, so without this guard we'd toggle
                    // show→hide on the very same click.
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event {
                        if let Some(window) = app_handle_for_tray.get_webview_window("main") {
                            let is_visible = window.is_visible().unwrap_or(false);
                            if is_visible {
                                let _ = window.hide();
                            } else {
                                let _ = window.move_window(Position::TrayCenter);
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_display_snapshot,
            show_reminder_overlay,
            quit_app,
            hide_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running FinalCall");
}


