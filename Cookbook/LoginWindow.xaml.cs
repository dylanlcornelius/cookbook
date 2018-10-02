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
using System.Windows.Shapes;

namespace Cookbook
{
    /// <summary>
    /// Interaction logic for LoginWindow.xaml
    /// </summary>
    public partial class LoginWindow : Window
    {
        private bool? result = false;

        public LoginWindow()
        {
            InitializeComponent();
        }

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
            fadeOut.Completed += (s, _) => DialogResult = result;
            BeginAnimation(OpacityProperty, fadeOut);
        }

        private void tbxUsername_TextChanged(object sender, TextChangedEventArgs e)
        {
            lblUsername.BorderBrush = Brushes.Gray;
        }

        private void btnLogin_MouseDown(object sender, MouseButtonEventArgs e)
        {
            SetFadeOutColor(btnLogin);
        }

        private void btnLogin_MouseUp(object sender, MouseButtonEventArgs e)
        {
            SetFadeInColor(btnLogin);

            if (tbxUsername.Text == "dc")
            {
                result = true;
                Close();
            }
            else
            {
                lblUsername.BorderBrush = Brushes.Red;
            }
        }

        private void SetFadeOutColor(Label btn)
        {
            btn.Background = (SolidColorBrush)(new BrushConverter().ConvertFrom("#0A0A0A"));
        }
        private void SetFadeInColor(Label btn)
        {
            btn.Background = Brushes.Black;
        }
    }
}
