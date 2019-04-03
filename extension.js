const {GLib, St, Clutter} = imports.gi;
const {main} = imports.ui;

class SimpleDateFormat
{
	constructor(format)
	{
		this.format = format;
		this.timeoutId = 0;
		this.originalClockDisplay = main.panel.statusArea.dateMenu._clockDisplay;
		this.formatClockDisplay = new St.Label({
			y_align: Clutter.ActorAlign.CENTER,
		});
	}

	enable()
	{
		this.originalClockDisplay.hide();
		this.originalClockDisplay.get_parent().insert_child_below(
			this.formatClockDisplay, this.originalClockDisplay
		);
		this.formatClockDisplay.set_text(new Date().toLocaleFormat(this.format));
		this.timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 60, () => {
			this.formatClockDisplay.set_text(new Date().toLocaleFormat(this.format));
			return true;
		});
	}

	disable()
	{
		GLib.Source.remove(this.timeoutId);
		this.timeoutId = 0;
		this.originalClockDisplay.get_parent().remove_child(this.formatClockDisplay);
		this.originalClockDisplay.show();
	}

}

const init = () => new SimpleDateFormat('%Y.%m.%d %H:%M');
