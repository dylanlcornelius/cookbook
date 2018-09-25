using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;

namespace Cookbook
{
    /// <summary>
    /// Interaction logic for ucTitleBar.xaml
    /// </summary>
    public partial class ucTitleBar : UserControl
    {
        public ucTitleBar()
        {
            InitializeComponent();

            lblTitle.PreviewMouseLeftButtonDown += (s, e) => Window.GetWindow(this).DragMove();
        }

        private void btnClose_MouseEnter(object sender, MouseEventArgs e)
        {
            btnClose.Foreground = Brushes.LightGray;
        }

        private void btnClose_MouseLeave(object sender, MouseEventArgs e)
        {
            btnClose.Foreground = Brushes.Gray;
        }

        private void btnClose_MouseUp(object sender, MouseButtonEventArgs e)
        {
            Window.GetWindow(this).Close();
        }
    }
}
