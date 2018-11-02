<p align="center">
  <a href="https://canvasfilesync.com" target="_blank">
    <img width="200"src="./static/icons_normal/logo.png">
  </a>
</p>
<p align="center">
    <img src="https://travis-ci.com/drew-royster/canvasFileSync.svg?branch=master">
</p>

# Introduction

When using Canvas, I found that constantly downloading new files, updated files and then organizing those files was a huge pain. This program aims to work by having Google Drive like functionality with Canvas so that you never have to worry about being up to date or how you have organized things, because they will be organized on your computer just as they are organized on Canvas.

[Canvas File Sync Site](https://canvasfilesync.com)

## Running this code

Clone this repository and run `yarn`. Once it's done installing the modules, run `yarn run dev`

## Building this code

`yarn run build:mac`

`yarn run build:win`

### Note

Releases are being code signed so your personal build will not work with the built in autoupdating.

## TODO
- [ ] Toggle courses/folders to sync
- [ ] Increase initial download speed
- [ ] Handle situations more gracefully where an update has occurred both locally and remotely
- [ ] Handle courses where professor uses modules view(files api is disabled when they do this)


