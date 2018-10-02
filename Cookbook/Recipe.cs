using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cookbook
{
    class Recipe
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<Category> Category { get; set; }
        public int PrepTime { get; set; }
        public double Servings { get; set; }
        public int Calories { get; set; }
        public int Quantity { get; set; }

        public Recipe(int Id, string Name, List<Category> Category, int PrepTime, double Servings, int Calories, int Quantity)
        {
            this.Id = Id;
            this.Name = Name;
            this.Category = Category;
            this.PrepTime = PrepTime;
            this.Servings = Servings;
            this.Calories = Calories;
            this.Quantity = Quantity;
        }
    }
}
