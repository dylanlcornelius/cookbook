using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cookbook
{
    class Category
    {
        public int Id { get; set; }
        public string Type { get; set; }

        public Category(int Id, string Type)
        {
            this.Id = Id;
            this.Type = Type;
        }
    }
}
