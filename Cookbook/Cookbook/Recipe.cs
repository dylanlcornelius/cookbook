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
        public string Category { get; set; }
        //public List<RecipeCategories> Category { get; set; }
        public int PrepTime { get; set; }
        public int Servings { get; set; }
        public int Calories { get; set; }
        public int Quantity { get; set; }

        public Recipe(int Id, string Name, String Category, int PrepTime, int Servings, int Calories, int Quantity)
        //public Recipe (int Id, string Name, List<RecipeCategories> Category, int PrepTime, int Servings, int Calories, int Quantity)
        {
            this.Id = Id;
            this.Name = Name;
            this.Category = Category;
            this.PrepTime = PrepTime;
            this.Servings = Servings;
            this.Calories = Calories;
            this.Quantity = Quantity;
        }

        //convert to list of tags
        public enum RecipeCategories
        {
            Breakfast = 0,
            Bread = 1,
            Pasta = 2,
            Salad = 3,
            Sandwich = 4,
            Pizza = 5,
            Chicken = 6,
            Beef = 7,
            Pork = 8,
            Quick = 9
        }
    }
}
