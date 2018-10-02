using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace Cookbook
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            List<Recipe> recipes = new List<Recipe>()
            {
                new Recipe(0, "Mac 'n Cheese", null, 20, 2, 400, 0),
                new Recipe(1, "Sandwich", null, 10, 1, 340, 4)
            };

            dtgRecipes.ItemsSource = recipes;

            string connStr = DBConn.Default.ConnectionString;
            using(MySqlConnection conn = new MySqlConnection(connStr))
            {
                conn.Open();
                MySqlCommand cmd = new MySqlCommand("Select * from test;", conn);
                MySqlDataReader reader = cmd.ExecuteReader();

                while(reader.Read())
                {
                    Console.WriteLine(reader["id"]);
                }
            }
        }

        #region FADING/UTILITY

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            DoubleAnimation fadeIn = new DoubleAnimation(0, 1, TimeSpan.FromSeconds(0.4));
            BeginAnimation(OpacityProperty, fadeIn);
        }

        private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            Closing -= Window_Closing;
            e.Cancel = true;
            DoubleAnimation fadeOut = new DoubleAnimation(1, 0, TimeSpan.FromSeconds(0.2));
            fadeOut.Completed += (s, _) => Close();
            BeginAnimation(OpacityProperty, fadeOut);
        }

        private void SetFadeOutColor(Label btn, Grid pnl = null)
        {
            btn.Background = (SolidColorBrush)(new BrushConverter().ConvertFrom("#0A0A0A"));
            if (pnl != null)
            {
                pnl.Background = (SolidColorBrush)(new BrushConverter().ConvertFrom("#0A0A0A"));
            }
        }
        private void SetFadeInColor(Label btn, Grid pnl = null)
        {
            btn.Background = Brushes.Black;
            if (pnl != null)
            {
                pnl.Background = Brushes.Black;
            }
        }

        private void SwitchPanels(Grid pnl)
        {
            foreach (UIElement child in pnlMainGrid.Children)
            {
                Grid grid = child as Grid;
                if (grid != null)
                {
                    if (grid != pnl)
                    {
                        grid.Visibility = Visibility.Hidden;
                    }
                    else
                    {
                        grid.Visibility = Visibility.Visible;
                    }
                }
            }
        }

        #endregion

        #region RECIPES PANEL

        private void btnRecipes_MouseDown(object sender, MouseButtonEventArgs e)
        {
            SetFadeOutColor(btnRecipes, pnlRecipes);
            SwitchPanels(pnlRecipes);
        }

        private void btnRecipes_MouseUp(object sender, MouseButtonEventArgs e)
        {
            SetFadeInColor(btnRecipes, pnlRecipes);
        }

        private void btnRemove_MouseDown(object sender, MouseButtonEventArgs e)
        {
            Label btn = (Label)sender;
            SetFadeOutColor(btn);
        }

        private void btnRemove_MouseUp(object sender, MouseButtonEventArgs e)
        {
            Label btn = (Label)sender;
            SetFadeInColor(btn);
            Recipe r = (Recipe)dtgRecipes.SelectedItem;
            if (r.Quantity > 0)
            {
                r.Quantity--;
            }
            dtgRecipes.Items.Refresh();
        }

        private void btnAdd_MouseDown(object sender, MouseButtonEventArgs e)
        {
            Label btn = (Label)sender;
            SetFadeOutColor(btn);
        }

        private void btnAdd_MouseUp(object sender, MouseButtonEventArgs e)
        {
            Label btn = (Label)sender;
            SetFadeInColor(btn);
            Recipe r = (Recipe)dtgRecipes.SelectedItem;
            r.Quantity++;
            dtgRecipes.Items.Refresh();
        }

        private void btnEdit_MouseDown(object sender, MouseButtonEventArgs e)
        {
            Label btn = (Label)sender;
            SetFadeOutColor(btn);
        }

        private void btnEdit_MouseUp(object sender, MouseButtonEventArgs e)
        {
            Label btn = (Label)sender;
            SetFadeInColor(btn);
            //set recipe edit panel's recipe
            SwitchPanels(pnlRecipeEdit);
        }

        #endregion

        #region RECIPE EDIT PANEL

        private void btnRecipeEdit_MouseDown(object sender, MouseButtonEventArgs e)
        {
            SetFadeOutColor(btnRecipeEdit, pnlRecipeEdit);
            SwitchPanels(pnlRecipeEdit);
        }

        private void btnRecipeEdit_MouseUp(object sender, MouseButtonEventArgs e)
        {
            SetFadeInColor(btnRecipeEdit, pnlRecipeEdit);
        }

        #endregion

        #region INGREDIENTS PANEL

        private void btnIngredients_MouseDown(object sender, MouseButtonEventArgs e)
        {
            SetFadeOutColor(btnIngredients, pnlIngredients);
            SwitchPanels(pnlIngredients);
        }

        private void btnIngredients_MouseUp(object sender, MouseButtonEventArgs e)
        {
            SetFadeInColor(btnIngredients, pnlIngredients);
        }

        #endregion
    }
}
