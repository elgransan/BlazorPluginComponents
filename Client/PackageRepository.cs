using BlazorPlugin2.Shared;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using System.Net.Http.Json;
using System.Runtime.Loader;

namespace BlazorPlugin2.Client;

public class PackageRepository : IPackageRepository
{
    private readonly HttpClient Http;
    private readonly NavigationManager MyNavigationManager;
    private List<Package> packages = new();

    public PackageRepository(HttpClient http, NavigationManager myNavigationManager)
    {
        Http = http;
        MyNavigationManager = myNavigationManager;
    }

    public async Task<List<Package>> GetList()
    {
        if (packages.Count == 0)
        {
            var result = await Http.GetFromJsonAsync<List<Package>>("/ModuleManager");
            if (result != null) packages = result;
        }

        return packages;
    }

    public bool CheckLoaded(string package)
    {
        return packages.Any(s => s.Name == package && s.IsLoaded);
    }

    public async Task Upload(IBrowserFile file)
    {
        using var content = new MultipartFormDataContent();

        var fileContent = new StreamContent(file.OpenReadStream());

        content.Add(
            content: fileContent,
            name: "\"file\"",
            fileName: file.Name);

        var response = await Http.PostAsync("/ModuleManager", content);
    }

    public async Task<bool> Load(Package package)
    {
        if(package.Name != null && CheckLoaded(package.Name)) return true;

        try
        {
            var stream = await Http.GetStreamAsync($"{MyNavigationManager.BaseUri}/_content/{package.Name}/{package.Name}.dll");
            var assembly = AssemblyLoadContext.Default.LoadFromStream(stream);
            package.Assembly = assembly;
            try
            {
                var stream2 = await Http.GetStreamAsync($"{MyNavigationManager.BaseUri}/_content/{package.Name}/{package.Name}.pdb");
                var symbols = AssemblyLoadContext.Default.LoadFromStream(stream2);
                package.Symbols = symbols;
            }
            catch
            {
                Console.WriteLine($"No symbols loaded for {package.Name}");
            }
            package.Components = assembly.GetExportedTypes().Select(s => (s.FullName ?? "", s.BaseType?.Name ?? "")).ToList();
            package.IsLoaded = true;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return false;
        }

        return true;
    }
}
