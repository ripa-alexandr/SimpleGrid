using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(SimpleGrid.Startup))]
namespace SimpleGrid
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
