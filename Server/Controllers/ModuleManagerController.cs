using BlazorPlugin2.Shared;
using Microsoft.AspNetCore.Mvc;
using System.IO.Compression;
using System.Net;
using System.Reflection;

namespace BlazorPlugin2.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ModuleManagerController : Controller
    {
        private readonly IWebHostEnvironment env;

        public ModuleManagerController(IWebHostEnvironment env)
        {
            this.env = env;
        }

        [HttpGet]
        public List<Package> Get()
        {
            string path = Path.Combine(env.WebRootPath, "_content");

            List<Package> packages = new();
            foreach (string folder in Directory.GetDirectories(path))
            {
                packages.Add(new Package { Name = Path.GetFileName(folder) });
            }

            return packages;
        }

        [HttpPost]
        public async Task<IActionResult> Index([FromForm] IFormFile file)
        {
            // Check folder name
            using MemoryStream ms = new();
            await file.OpenReadStream().CopyToAsync(ms);
            var bytes = ms.ToArray();
            var folderName = file.FileName.Substring(0, file.FileName.IndexOf('.'));

            // Create server path
            string path = Path.Combine(env.WebRootPath, "_content", folderName);
            Directory.CreateDirectory(path);

            // Save resources
            await LoadNuget(bytes, path);

            return Created($"/_content/{folderName}", folderName);
        }

        private async Task LoadNuget(byte[] nugetFile, string folder)
        {
            var validFormats = new string[] { ".dll", ".pdb", ".css", ".js", ".png", ".jpg", ".jpeg", ".gif", ".json", ".txt", ".csv" };

            using ZipArchive archive = new ZipArchive(new MemoryStream(nugetFile));

            // Read all 
            foreach (ZipArchiveEntry entry in archive.Entries)
            {
                if (validFormats.Contains(Path.GetExtension(entry.Name))
                    || entry.Name == "Microsoft.AspNetCore.StaticWebAssets.props") // Static content specification
                {
                    string path = Path.Combine(folder, entry.Name);
                    using Stream zipStream = entry.Open();
                    using FileStream fileStream = new FileStream(path, FileMode.Create);
                    await zipStream.CopyToAsync(fileStream);
                }
            }
        }
    }
}
