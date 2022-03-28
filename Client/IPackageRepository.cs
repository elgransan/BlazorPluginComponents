using BlazorPlugin2.Shared;
using Microsoft.AspNetCore.Components.Forms;

namespace BlazorPlugin2.Client
{
    public interface IPackageRepository
    {
        bool CheckLoaded(string package);
        Task<List<Package>> GetList();
        Task<bool> Load(Package package);
        Task Upload(IBrowserFile nugetPackage);
    }
}