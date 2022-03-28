using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace BlazorPlugin2.Shared;

public class Package
{
    public string? Name { get; set; }
    public string? Version { get; set; }
    public bool IsLoaded { get; set; }
    public List<(string, string)> Components { get; set; } = new();
    public Assembly? Assembly { get; set; }
}
