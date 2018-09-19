using System;
using System.Drawing;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Cookbook
{
    public partial class LoginForm : Form
    {
        private const string USERNAME_TEXT = "username";
        private const string LOGIN_BLANK_TEXT = "All fields are required";
        private const string LOGIN_ERROR_TEXT = "Some fields are incorrect";

        private const int BACKCOLOR = 0;
        private const int HIGHLIGHT = 60;

        private bool isMouseDown = false;
        private Point firstPoint;

        public LoginForm()
        {
            InitializeComponent();

            tbxUsername.Text = USERNAME_TEXT;
            tbxUsername.ForeColor = Color.DimGray;
            tbxUsername.Font = new Font(tbxUsername.Font, FontStyle.Italic);
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

        private void LoginForm_MouseDown(object sender, MouseEventArgs e)
        {
            ActiveControl = null;
        }

        #region tbxUSERNAME

        private void tbxUsername_Enter(object sender, EventArgs e)
        {
            if (tbxUsername.Text.Equals(USERNAME_TEXT))
            {
                tbxUsername.Text = "";
                tbxUsername.ForeColor = Color.Gray;
                tbxUsername.Font = new Font(tbxUsername.Font, FontStyle.Regular);
            }
        }

        private void tbxUsername_Leave(object sender, EventArgs e)
        {
            if (String.IsNullOrWhiteSpace(tbxUsername.Text))
            {
                tbxUsername.Text = USERNAME_TEXT;
                tbxUsername.ForeColor = Color.DimGray;
                tbxUsername.Font = new Font(tbxUsername.Font, FontStyle.Italic);
            }
        }

        private void tbxUsername_TextChanged(object sender, EventArgs e)
        {
            pnlUsername.BackColor = Color.Black;
        }

        private void tbxUsername_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter || e.KeyCode == Keys.Return)
            {
                LoginValidation();
            }
        }

        private void tbxUsername_KeyPress(object sender, KeyPressEventArgs e)
        {
            if (e.KeyChar == (char)13)
            {
                e.Handled = true;
            }
        }

        #endregion

        #region btnLOGIN

        private void btnLogin_Click(object sender, EventArgs e)
        {
            LoginValidation();
        }

        private void btnLogin_MouseDown(object sender, MouseEventArgs e)
        {
            FadeIn(btnLogin);
        }

        private void btnLogin_MouseUp(object sender, MouseEventArgs e)
        {
            FadeOut(btnLogin);
        }

        #endregion

        private void LoginValidation()
        {
            //***DO LOGIN CONNECTION CHECKING HERE***

            if (tbxUsername.Text == "dc")
            {
                DialogResult = DialogResult.OK;
                Close();
            }
            else
            {
                pnlUsername.BackColor = Color.Red;
                if (String.IsNullOrWhiteSpace(tbxUsername.Text) || tbxUsername.Text.Equals(USERNAME_TEXT))
                {
                    lblError.Text = LOGIN_BLANK_TEXT;
                }
                else
                {
                    lblError.Text = LOGIN_ERROR_TEXT;
                }
            }
        }

        #region FADING

        async private void FadeIn(Button btn)
        {
            Color fadeColor;
            for (int i = BACKCOLOR; i <= HIGHLIGHT; i += 20)
            {
                fadeColor = Color.FromArgb(i, i, i);
                btn.BackColor = fadeColor;
                await Delay();
            }
        }

        async private void FadeOut(Button btn)
        {
            Color fadeColor;
            for (int i = HIGHLIGHT; i >= BACKCOLOR; i -= 10)
            {
                fadeColor = Color.FromArgb(i, i, i);
                btn.BackColor = fadeColor;
                await Delay();
            }
        }

        async Task Delay()
        {
            await Task.Delay(1);
        }

        #endregion
    }
}
