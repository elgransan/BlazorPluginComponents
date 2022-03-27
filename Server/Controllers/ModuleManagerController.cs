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

        [HttpPost]
        public async Task<CreatedResult> Index([FromForm] IFormFile file)
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
            LoadNuget(bytes, path);

            return new CreatedResult(path, path);
        }

        private void LoadNuget(byte[] nugetFile, string folder)
        {
            var validFormats = new string[] { ".dll", ".pdb", ".css", ".js", ".png", ".jpg", ".jpeg", ".gif", ".json", ".txt", ".csv" };

            using ZipArchive archive = new ZipArchive(new MemoryStream(nugetFile));

            // Read all 
            foreach (ZipArchiveEntry entry in archive.Entries)
            {
                if (validFormats.Contains(Path.GetExtension(entry.Name)))
                {
                    string path = Path.Combine(folder, entry.Name);
                    entry.ExtractToFile(path);
                }
            }
        }
    }
}
