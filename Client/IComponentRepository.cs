using Microsoft.AspNetCore.Components.Forms;

namespace BlazorPlugin2.Client
{
    public interface IComponentRepository
    {
        bool CheckLoaded(string component);
        Task GetList();
        bool LoadComponent(string name);
        Task UploadComponent(IBrowserFile nugetPackage);
    }
}