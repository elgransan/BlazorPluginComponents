using Microsoft.AspNetCore.Components.Forms;
using System.IO.Compression;
using System.Net.Http.Json;
using System.Reflection;

namespace BlazorPlugin2.Client;

public class ComponentRepository
{
	private readonly HttpClient client;
	record BlazorComponent(string name, Assembly assembly, Assembly pdb, Type type, bool loaded);
	private List<BlazorComponent> components = new();

	public ComponentRepository(HttpClient http)
    {
		this.client = http;
    }

	public async Task GetList()
    {
		var result = await client.GetFromJsonAsync<List<BlazorComponent>>("/api/components");
		if (result != null) components = result;
    }

	public bool CheckLoaded(string component)
    {
		return components.Any(s => s.name == component && s.loaded);
    }

    public async Task UploadComponent(IBrowserFile nugetPackage)
    {
		using MemoryStream ms = new();
		await nugetPackage.OpenReadStream().CopyToAsync(ms);

		using ZipArchive archive = new ZipArchive(ms);

		var dlls = new Dictionary<string, byte[]>();
		var pdbs = new Dictionary<string, byte[]>();
		var ccss = new Dictionary<string, byte[]>();
		var jss = new Dictionary<string, byte[]>();
		var contents = new Dictionary<string, byte[]>();

		// Read all 
		foreach (ZipArchiveEntry entry in archive.Entries)
		{
			using var memoryStream = new MemoryStream();
			entry.Open().CopyTo(memoryStream);
			byte[] file = memoryStream.ToArray();
			switch (Path.GetExtension(entry.FullName))
			{
				case ".dll":
				case ".pdb":
				case ".css":
				case ".js":
				case ".png":
				case ".jpeg":
				case ".jpg":
				case ".gif":
					//await UploadResources(nugetPackage.Name, entry);
					break;
			}
		}

		// Load component
		/*
		foreach (var item in dlls)
		{
			switch (Path.GetExtension(entry.FullName))
			{
				case ".dll":
				case ".pdb":

					break;
			}
			if (pdbs.ContainsKey(item.Key))
			{
				var assembly = Assembly.Load(item.Value, pdbs[item.Key]);
				components.Add(assembly.GetType(component2));
			}
			else
			{
				var assembly = Assembly.Load(item.Value);
				components.Add(assembly.GetType(component2));
			}
		}*/
	}

	public bool LoadComponent(string name)
	{
		var component = components.FirstOrDefault(s => s.name == name);
		if (component == null) return false;
		if (component.loaded) return true;

		// Load component


		return true;
	}
}
