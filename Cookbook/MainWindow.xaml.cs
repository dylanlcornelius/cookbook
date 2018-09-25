using System;
using System.Collections.Generic;
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
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            DoubleAnimation fadeIn = new DoubleAnimation(0, 1, TimeSpan.FromSeconds(0.5));
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

        private void btnRecipes_MouseDown(object sender, MouseButtonEventArgs e)
        {
            pnlRecipes.Visibility = Visibility.Visible;
            pnlIngredients.Visibility = Visibility.Hidden;
            SetFadeOutColor(btnRecipes, pnlRecipes);
        }

        private void btnRecipes_MouseUp(object sender, MouseButtonEventArgs e)
        {
            SetFadeInColor(btnRecipes, pnlRecipes);
        }

        private void btnIngredients_MouseDown(object sender, MouseButtonEventArgs e)
        {
            pnlRecipes.Visibility = Visibility.Hidden;
            pnlIngredients.Visibility = Visibility.Visible;
            SetFadeOutColor(btnIngredients, pnlIngredients);
        }

        private void btnIngredients_MouseUp(object sender, MouseButtonEventArgs e)
        {
            SetFadeInColor(btnIngredients, pnlIngredients);
        }

        private void SetFadeOutColor(Label btn, DockPanel pnl)
        {
            btn.Background = (SolidColorBrush)(new BrushConverter().ConvertFrom("#0A0A0A"));
            pnl.Background = (SolidColorBrush)(new BrushConverter().ConvertFrom("#0A0A0A"));
        }
        private void SetFadeInColor(Label btn, DockPanel pnl)
        {
            btn.Background = Brushes.Black;
            pnl.Background = Brushes.Black;
        }
    }
}
