
## jSQL Devel v2.0.6

jSQL Devel is a fun little development tool for [jSQL](https://github.com/Pamblam/jSQL).

jSQL Devel plugs into the jSQL object and exposes methods that create an interface in the browser that can be used to generate code and manage data.

#### There are two ways to use it

 - *Including the script manually* - you can include the `jsql-devel.js` or `jsql-devel.min.js` in your HTML and programmatically open and close the interface (perhaps from the browser console).
 - *Using the browser toolbar button* - The build process generates a Javascript URI that you can drag into your browser's bookmarks toolbar to run on any page without any dependencies. Run the toolbar generator in this repository's `/demos` folder to get the button.

#### API Methods

There are methods to control just about everything, but these are the important ones:

 - `jSQL.devel.open(options)` - Open the interface.
  - `options.theme` - A jQuery UI theme name.
  - `options.wrapper` - A query selector for the element to draw the developer in. In not provided it's drawn on top of everything else.
  - `options.bg` - The background as provided to CSS's `background` property.
  - `options.header_img` - The URL of the image to display in the header. If not provided the jSQL logo is shown. If `false` is provided no image is drawn. 
  - `options.loader_img` - The URL of the image to display as the tool is loading. If not provided the jSQL logo is shown. If `false` is provided no image is drawn.
 - `jSQL.devel.close()` - Close the interface.


### Table Wizard Generates Table Code

Making development easier :rainbow:

![Table Wizard](https://i.imgur.com/f0oZnsL.gif)

### Code Generator Generates (Javascript) Code

App ready code the way you like it :hamburger:

![Code Generator](https://i.imgur.com/gI7xhSF.gif)

### Fully Customizable Interface

Just for Fuuuuun :ghost:

![Customizable interface](https://i.imgur.com/klVv7TR.gif)

### Does prepared statements too

Watch this :wrench:

![Prepared statements](https://i.imgur.com/tjFpGH6.gif)

### Comes with a browser button maker

Make the fanciest buttons :gun:

![Button maker](https://i.imgur.com/ngEWyTF.gif)