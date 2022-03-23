"..\Server\Packages\nuget.exe" pack RazorClassLibrary3.nuspec 
XCOPY "*.nupkg" "..\Server\wwwroot\Packages\" /Y

