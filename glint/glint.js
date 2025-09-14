// Export all framework classes
export { Widget, StatelessWidget, StatefulWidget } from './framework/widget.js';
export { Element } from './framework/element.js';
export { App, runApp } from './framework/app.js';

// Export basic widgets
export { Text } from './widgets/basic/Text.js';
export { Container } from './widgets/basic/Container.js';
export { Button } from './widgets/basic/Button.js';

// Export layout widgets
export { Column } from './widgets/layout/Column.js';
export { Row } from './widgets/layout/Row.js';
export { Expanded } from './widgets/layout/Expanded.js';
export { Center } from './widgets/layout/Center.js';
export { SizedBox } from './widgets/layout/SizedBox.js';

// Export individual widgets for testing
export { AppBar } from './widgets/navigation/AppBar.js';
export { BottomNavigationBar } from './widgets/navigation/BottomNavigationBar.js';
export { Drawer } from './widgets/navigation/Drawer.js';
export { ListTile } from './widgets/navigation/ListTile.js';

export { TextField } from './widgets/input/TextField.js';

export { Card } from './widgets/display/Card.js';
export { Icon } from './widgets/display/Icon.js';
export { Image } from './widgets/display/Image.js';
export { Divider } from './widgets/display/Divider.js';
export { Spacer } from './widgets/display/Spacer.js';
export { CircularProgressIndicator } from './widgets/display/CircularProgressIndicator.js';
export { LinearProgressIndicator } from './widgets/display/LinearProgressIndicator.js';

// Temporarily commenting out new widgets to test if they're causing the issue
// Export input widgets
// export { 
//   TextField, 
//   Checkbox, 
//   RadioButton, 
//   Switch, 
//   Slider 
// } from './widgets/input.js';

// // Export display widgets
// export { 
//   Image, 
//   Icon, 
//   Divider, 
//   Spacer, 
//   Card, 
//   CircularProgressIndicator, 
//   LinearProgressIndicator 
// } from './widgets/display.js';

// // Export navigation widgets
// export { 
//   AppBar, 
//   BottomNavigationBar, 
//   Drawer, 
//   DrawerHeader, 
//   ListTile 
// } from './widgets/navigation.js';

// // Export scrolling widgets
// export { 
//   SingleChildScrollView, 
//   ListView, 
//   ListViewBuilder, 
//   GridView, 
//   GridViewBuilder 
// } from './widgets/scrolling.js';

// // Export interaction widgets
// export { 
//   GestureDetector, 
//   InkWell, 
//   Dismissible, 
//   Draggable 
// } from './widgets/interaction.js';