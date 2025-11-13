using Godot;
using System;
using System.Linq;

public partial class ControllerOptions : Node
{
	public const string CONFIG_FILE_LOCATION = "user://controller.cfg";


	public override void _Ready()
	{
		if (!FileAccess.FileExists(CONFIG_FILE_LOCATION))
		{
			ConfigFile configFile = new ConfigFile();
			foreach (string actionMapping in InputMap.GetActions())
			{
				// check the current inputEvents of the bunch.
				Godot.Collections.Array<InputEvent> inputEvents = InputMap.ActionGetEvents(actionMapping);
				var keyValues = inputEvents.Where(new Func<InputEvent, bool>((target) => target is InputEventKey));

			}
		}
	}

	// Called every frame. 'delta' is the elapsed time since the previous frame.
	public override void _Process(double delta)
	{
	}
}
