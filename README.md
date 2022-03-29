# Blazor Plugin Components

You can load dynamically and without registering the RCL (Razor Class Library) on the project all the components you want with this project.

When you publish a RCL you get this kind of files:
* The Assembly (dll) and the Symbols (pdb) files
* The Assets for the components:
  * css isolated or not
  * javascript
  * images
  * other resource stuff

You can generate all this with "dotnet publish" or you can get all in one file using "dotnet package" where you get a Nuget Package

The project shows 4 ways to import and load a RCL component:

1. The standard way, creating a project dependency
2. Putting all the RCL files in a folder under wwwroot
3. Manually uploading the files all in one upload
4. Using the Module Manager witch allows you to load a RCL Nuget Package and upload to the server. Once uploaded you don't have to upload again and you can use it what ever you want

Example



![test](https://user-images.githubusercontent.com/9949584/160662593-5f765ee3-149c-4a0c-a0fe-a22d6a3193c7.gif)

