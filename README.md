# Blazor Plugin Components

You can load dynamically and without registering the RCL (Razor Class Library) on the project all the components you want with this project.

## Installation

* git clone the repo
* compile first RazorClassLibrary2 because a post-build command copy those files to the main project. If you don't do it, you will get an error message
* run the server
* enjoy

## Project Details

When you publish a RCL you get this kind of files:
* The Assembly (dll) and the Symbols (pdb) files
* The Assets for the components:
  * css isolated or not
  * javascript
  * images
  * other resource stuff

You can generate all this with "dotnet publish" or you can get all in one file using "dotnet pack" where you get a Nuget Package

The project shows 4 ways to import and load a RCL component:

1. The standard way, creating a project dependency
2. Putting all the RCL files in a folder under wwwroot and get dynamically those files
3. Manually uploading all the files
4. Using the Module Manager wich allows you to load a RCL Nuget Package and upload to the server. Once uploaded you don't have to upload again and you can use it whenever you want

Example

![test](https://user-images.githubusercontent.com/9949584/160662593-5f765ee3-149c-4a0c-a0fe-a22d6a3193c7.gif)


Dynamic page loader from a RCL project

You can also load a page dynamically though the Module Manager as you can see in the example

![pageload](https://user-images.githubusercontent.com/9949584/170790487-02d37b12-465e-4afe-8f4f-365b953b5341.gif)
