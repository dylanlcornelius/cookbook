using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MealPlanner
{
    public partial class MainForm : Form
    {
        private bool isMouseDown = false;
        private Point firstPoint;

        public MainForm()
        {
            InitializeComponent();
        }

        #region TITLE BAR

        private void lblTitle_MouseMove(object sender, MouseEventArgs e)
        {
            if (isMouseDown)
            {
                int x = Location.X - firstPoint.X + e.X;
                int y = Location.Y - firstPoint.Y + e.Y;
                Location = new Point(x, y);
                Update();
            }
        }

        private void lblTitle_MouseDown(object sender, MouseEventArgs e)
        {
            firstPoint = e.Location;
            isMouseDown = true;
        }

        private void lblTitle_MouseUp(object sender, MouseEventArgs e)
        {
            isMouseDown = false;
        }

        private void btnClose_MouseDown(object sender, MouseEventArgs e)
        {
            btnClose.ForeColor = Color.Silver;
        }

        private void btnClose_MouseUp(object sender, MouseEventArgs e)
        {
            btnClose.ForeColor = Color.Gray;
        }

        private void btnClose_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        #endregion
    }
}
