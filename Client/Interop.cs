using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace BlazorPlugin2.Client;

public class Interop
{
    private readonly IJSRuntime _jsRuntime;

    public Interop(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
    }

    public Task IncludeLink(string href)
    {
        try
        {
            _jsRuntime.InvokeVoidAsync("BlazorPlugin2.Interop.includeLink", href);
            return Task.CompletedTask;
        }
        catch
        {
            return Task.CompletedTask;
        }
    }

    public Task AddLink(string style, string place = "head")
    {
        try
        {
            _jsRuntime.InvokeVoidAsync("BlazorPlugin2.Interop.addLink", style, place);
            return Task.CompletedTask;
        }
        catch
        {
            return Task.CompletedTask;
        }
    }

    public Task IncludeScript(string src)
    {
        try
        {
            _jsRuntime.InvokeVoidAsync("BlazorPlugin2.Interop.includeScript", src);
            return Task.CompletedTask;
        }
        catch
        {
            return Task.CompletedTask;
        }
    }
}
