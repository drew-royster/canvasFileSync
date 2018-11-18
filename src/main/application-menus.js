const { Menu } = require("electron"); // eslint-disable-line

const template = [
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Copy',
        accelerator: 'CommandOrControl+C', // B
        role: 'copy', // C
      },
      {
        label: 'Paste',
        accelerator: 'CommandOrControl+V',
        role: 'paste',
      },
      {
        label: 'Select All',
        accelerator: 'CommandOrControl+A',
        role: 'selectall',
      },
      {
        label: 'Zoom In',
        role: 'zoomin',
      },
      {
        label: 'Zoom Out',
        role: 'zoomout',
      },
    ],
  },
];

module.exports = Menu.buildFromTemplate(template);
