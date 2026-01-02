let layouts = ["FullScreen", "TwoPane"];
let currentLayout = 1;
let stickyWindow = undefined;
let leftWindow = undefined;

const tileLeft = (window) => {
  let rectangle = Screen.main().visibleFrame();
  rectangle.width = rectangle.width / 2;
  window.setFrame(rectangle);
  leftWindow = window;
};

const tileRight = (window) => {
  let rectangle = Screen.main().visibleFrame();
  rectangle.width = rectangle.width / 2;
  rectangle.x = rectangle.width;
  window.setFrame(rectangle);
};

const setStickyWindow = (window) => {
  tileRight(window);
  stickyWindow = window;
};

const tileNextWindow = (window) => {
  if (layouts[currentLayout] === "FullScreen") return window.maximise();
  if (stickyWindow && window.hash() === stickyWindow.hash())
    return tileRight(window);
  return tileLeft(window);
};

const focusNextWindow = (app, appLauncher) => {
  if (!app)
    return App.launch(appLauncher, { focus: true });

  let windowCandidates = app.windows({ visible: true });
  if (windowCandidates.length === 0)
    return App.launch(appLauncher, { focus: true });

  if (app.name() !== App.focused().name()) return windowCandidates[0].focus();
  return windowCandidates[windowCandidates.length - 1].focus();
};

const launchOrCycle = (appName, appLauncher) => {
  let app = App.get(appName);
  focusNextWindow(app, appLauncher);
  tileNextWindow(Window.focused());
};

const cycleLayouts = () => {
  currentLayout = (currentLayout + 1) % layouts.length;
  modal.text = layouts[currentLayout];
  modal.show();

  if (layouts[currentLayout] == "TwoPane") {
    let focusedWindow = Window.focused();
    if (stickyWindow) {
      tileRight(stickyWindow);
      stickyWindow.focus();
    }
    tileLeft(focusedWindow);
    focusedWindow.focus();
    return;
  }

  if (layouts[currentLayout] == "FullScreen") {
    Window.focused().maximise();
    return;
  }
};

const screenFrame = Screen.main().flippedVisibleFrame();
const modal = Modal.build({ duration: 1, text: "no" });
modal.origin = {
  x: screenFrame.width / 2 - modal.frame().width / 2,
  y: screenFrame.height / 2 - modal.frame().height / 2,
};

const modifiers = ["command", "alt", "control"];

let safariHandler = new Key("s", modifiers, () => {
  launchOrCycle("Safari", "Safari");
});
let calendarHandler = new Key("c", modifiers, () => {
  launchOrCycle("Calendar", "Calendar");
});
let codeHandler = new Key("v", modifiers, () => {
  launchOrCycle("Code", "Visual Studio Code");
});
let remindersHandler = new Key("r", modifiers, () => {
  launchOrCycle("Reminders", "Reminders");
});
let mailHandler = new Key("m", modifiers, () => {
  launchOrCycle("Mail", "Mail");
});
let terminalHandler = new Key("t", modifiers, () => {
  launchOrCycle("Terminal", "Terminal");
});
let finderHandler = new Key("f", modifiers, () => {
  launchOrCycle("Finder", "Finder");
});
let githubHandler = new Key("g", modifiers, () => {
  launchOrCycle("GitHub Desktop", "GitHub Desktop");
});
let slackHandler = new Key("x", modifiers, () => {
  launchOrCycle("Slack", "Slack");
});
let zoomHandler = new Key("z", modifiers, () => {
  launchOrCycle("zoom.us", "zoom.us");
});
let vimHandler = new Key("e", modifiers, () => {
  launchOrCycle("MacVim", "MacVim");
});
let qSpaceHandler = new Key("q", modifiers, () => {
  launchOrCycle("ForkLift", "ForkLift");
});
let iTermHandler = new Key("w", modifiers, () => {
  launchOrCycle("iTerm2", "iTerm");
});

let setStickyHandler = new Key("return", modifiers, () => {
  setStickyWindow(Window.focused());
});

let layoutHandler = new Key("space", modifiers, () => {
  cycleLayouts();
});

let leftFocusHandler = new Key("1", modifiers, () => {
  leftWindow.focus();
});
let stickyFocusHandler = new Key("2", modifiers, () => {
  stickyWindow.focus();
});

let tileRightHandler = new Key("right", modifiers, () => {
  tileRight(Window.focused());
});
let tileLeftHandler = new Key("left", modifiers, () => {
  tileLeft(Window.focused());
});
