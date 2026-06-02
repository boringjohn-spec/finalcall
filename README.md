# FinalCall

FinalCall is a lightweight macOS menu bar reminder app prototype. It shows a playful airplane flyover before calendar events and locks each reminder to the display that contains the cursor when the reminder starts.

## Run the Web Preview

```sh
npm install
npm run dev
```

Open `http://127.0.0.1:1420/`.

## Build

```sh
npm run build
```

## Native App Notes

The Tauri shell is scaffolded in `src-tauri/`.

The implemented native commands are:

- `get_display_snapshot`: returns cursor position plus monitor bounds.
- `show_reminder_overlay`: opens a transparent always-on-top overlay window sized to the selected display.

Native packaging requires Rust and Cargo to be installed locally.
