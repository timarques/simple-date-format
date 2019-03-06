const GLib = imports.gi.GLib;
const St = imports.gi.St;
const main = imports.ui.main;
const Clutter = imports.gi.Clutter;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const format = '%Y.%m.%d %H:%M';

let originalClockDisplay;
let formatClockDisplay;
let timeoutID = 0;

function init() {
  originalClockDisplay = main.panel.statusArea.dateMenu._clockDisplay;
  formatClockDisplay = new St.Label({
    y_align: Clutter.ActorAlign.CENTER,
  });
}

function enable() {
  originalClockDisplay.hide();
  originalClockDisplay.get_parent().insert_child_below(formatClockDisplay, originalClockDisplay);
  formatClockDisplay.set_text(new Date().toLocaleFormat(format));
  timeoutID = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 60000, function(){
    formatClockDisplay.set_text(new Date().toLocaleFormat(format));
    return true;
  });
}

function disable() {
  GLib.Source.remove(timeoutID);
  timeoutID = 0;
  originalClockDisplay.get_parent().remove_child(formatClockDisplay);
  originalClockDisplay.show();
}
