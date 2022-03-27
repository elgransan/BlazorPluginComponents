using Microsoft.AspNetCore.Mvc;
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
            // Open Zip file

            // Read file by file

            // Save all files in corresponding folder

            using MemoryStream ms = new();
            await file.OpenReadStream().CopyToAsync(ms);
            var bytes = ms.ToArray();
            var assembly = Assembly.Load(bytes);
            var folderName = assembly.GetName().Name ?? file.FileName;

            string path = Path.Combine(env.WebRootPath, folderName);

            Directory.CreateDirectory(path);



            await using FileStream fs = new(path, FileMode.Create);
            await file.CopyToAsync(fs);

            return new CreatedResult(path, untrustedFileName);
        }
    }
}
