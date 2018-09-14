namespace Cookbook
{
    partial class MainForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle1 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle2 = new System.Windows.Forms.DataGridViewCellStyle();
            this.btnClose = new System.Windows.Forms.Button();
            this.lblTitle = new System.Windows.Forms.Label();
            this.pnlRecipes = new System.Windows.Forms.Panel();
            this.dgvRecipes = new System.Windows.Forms.DataGridView();
            this.btnRecipes = new System.Windows.Forms.Button();
            this.ucSearchBar1 = new Cookbook.ucSearchBar();
            this.colName = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colCategory = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colPrepTime = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colServings = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colCalories = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colQuantity = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colRemove = new System.Windows.Forms.DataGridViewButtonColumn();
            this.colAdd = new System.Windows.Forms.DataGridViewButtonColumn();
            this.colView = new System.Windows.Forms.DataGridViewButtonColumn();
            this.pnlRecipes.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dgvRecipes)).BeginInit();
            this.SuspendLayout();
            // 
            // btnClose
            // 
            this.btnClose.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(10)))), ((int)(((byte)(10)))), ((int)(((byte)(10)))));
            this.btnClose.FlatAppearance.BorderSize = 0;
            this.btnClose.FlatAppearance.MouseDownBackColor = System.Drawing.Color.FromArgb(((int)(((byte)(10)))), ((int)(((byte)(10)))), ((int)(((byte)(10)))));
            this.btnClose.FlatAppearance.MouseOverBackColor = System.Drawing.Color.FromArgb(((int)(((byte)(10)))), ((int)(((byte)(10)))), ((int)(((byte)(10)))));
            this.btnClose.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnClose.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnClose.ForeColor = System.Drawing.Color.Gray;
            this.btnClose.Location = new System.Drawing.Point(963, 12);
            this.btnClose.Name = "btnClose";
            this.btnClose.Size = new System.Drawing.Size(25, 25);
            this.btnClose.TabIndex = 0;
            this.btnClose.Text = "X";
            this.btnClose.UseVisualStyleBackColor = false;
            this.btnClose.Click += new System.EventHandler(this.btnClose_Click);
            this.btnClose.MouseDown += new System.Windows.Forms.MouseEventHandler(this.btnClose_MouseDown);
            this.btnClose.MouseUp += new System.Windows.Forms.MouseEventHandler(this.btnClose_MouseUp);
            // 
            // lblTitle
            // 
            this.lblTitle.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(10)))), ((int)(((byte)(10)))), ((int)(((byte)(10)))));
            this.lblTitle.Dock = System.Windows.Forms.DockStyle.Top;
            this.lblTitle.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblTitle.ForeColor = System.Drawing.Color.Gray;
            this.lblTitle.Location = new System.Drawing.Point(0, 0);
            this.lblTitle.Name = "lblTitle";
            this.lblTitle.Padding = new System.Windows.Forms.Padding(10);
            this.lblTitle.Size = new System.Drawing.Size(1000, 50);
            this.lblTitle.TabIndex = 1;
            this.lblTitle.Text = "Cookbook";
            this.lblTitle.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            this.lblTitle.MouseDown += new System.Windows.Forms.MouseEventHandler(this.lblTitle_MouseDown);
            this.lblTitle.MouseMove += new System.Windows.Forms.MouseEventHandler(this.lblTitle_MouseMove);
            this.lblTitle.MouseUp += new System.Windows.Forms.MouseEventHandler(this.lblTitle_MouseUp);
            // 
            // pnlRecipes
            // 
            this.pnlRecipes.Controls.Add(this.ucSearchBar1);
            this.pnlRecipes.Controls.Add(this.dgvRecipes);
            this.pnlRecipes.Location = new System.Drawing.Point(0, 65);
            this.pnlRecipes.Name = "pnlRecipes";
            this.pnlRecipes.Size = new System.Drawing.Size(1000, 535);
            this.pnlRecipes.TabIndex = 2;
            // 
            // dgvRecipes
            // 
            this.dgvRecipes.AllowUserToResizeColumns = false;
            this.dgvRecipes.AllowUserToResizeRows = false;
            this.dgvRecipes.BorderStyle = System.Windows.Forms.BorderStyle.None;
            dataGridViewCellStyle1.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleCenter;
            dataGridViewCellStyle1.BackColor = System.Drawing.SystemColors.Control;
            dataGridViewCellStyle1.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle1.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle1.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle1.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle1.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.dgvRecipes.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle1;
            this.dgvRecipes.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dgvRecipes.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.colName,
            this.colCategory,
            this.colPrepTime,
            this.colServings,
            this.colCalories,
            this.colQuantity,
            this.colRemove,
            this.colAdd,
            this.colView});
            this.dgvRecipes.Location = new System.Drawing.Point(13, 35);
            this.dgvRecipes.Name = "dgvRecipes";
            this.dgvRecipes.Size = new System.Drawing.Size(974, 488);
            this.dgvRecipes.TabIndex = 0;
            this.dgvRecipes.CellContentClick += new System.Windows.Forms.DataGridViewCellEventHandler(this.dgvRecipes_CellContentClick);
            // 
            // btnRecipes
            // 
            this.btnRecipes.FlatAppearance.BorderSize = 0;
            this.btnRecipes.FlatAppearance.MouseDownBackColor = System.Drawing.Color.FromArgb(((int)(((byte)(60)))), ((int)(((byte)(60)))), ((int)(((byte)(60)))));
            this.btnRecipes.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnRecipes.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnRecipes.ForeColor = System.Drawing.Color.Gray;
            this.btnRecipes.Location = new System.Drawing.Point(12, 50);
            this.btnRecipes.Margin = new System.Windows.Forms.Padding(0);
            this.btnRecipes.Name = "btnRecipes";
            this.btnRecipes.Size = new System.Drawing.Size(75, 25);
            this.btnRecipes.TabIndex = 3;
            this.btnRecipes.Text = "Recipes";
            this.btnRecipes.UseVisualStyleBackColor = true;
            this.btnRecipes.MouseDown += new System.Windows.Forms.MouseEventHandler(this.btnRecipes_MouseDown);
            this.btnRecipes.MouseUp += new System.Windows.Forms.MouseEventHandler(this.btnRecipes_MouseUp);
            // 
            // ucSearchBar1
            // 
            this.ucSearchBar1.BackColor = System.Drawing.Color.Turquoise;
            this.ucSearchBar1.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.ucSearchBar1.Location = new System.Drawing.Point(12, 13);
            this.ucSearchBar1.Name = "ucSearchBar1";
            this.ucSearchBar1.Size = new System.Drawing.Size(975, 25);
            this.ucSearchBar1.TabIndex = 1;
            // 
            // colName
            // 
            this.colName.HeaderText = "Recipe Name";
            this.colName.Name = "colName";
            // 
            // colCategory
            // 
            this.colCategory.HeaderText = "Category";
            this.colCategory.Name = "colCategory";
            // 
            // colPrepTime
            // 
            this.colPrepTime.HeaderText = "Preparation Time";
            this.colPrepTime.Name = "colPrepTime";
            // 
            // colServings
            // 
            this.colServings.HeaderText = "Servings";
            this.colServings.Name = "colServings";
            // 
            // colCalories
            // 
            this.colCalories.HeaderText = "Calories per Serving";
            this.colCalories.Name = "colCalories";
            // 
            // colQuantity
            // 
            this.colQuantity.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.None;
            dataGridViewCellStyle2.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleCenter;
            dataGridViewCellStyle2.Format = "N0";
            dataGridViewCellStyle2.NullValue = null;
            this.colQuantity.DefaultCellStyle = dataGridViewCellStyle2;
            this.colQuantity.HeaderText = "Qty";
            this.colQuantity.Name = "colQuantity";
            this.colQuantity.ReadOnly = true;
            this.colQuantity.Resizable = System.Windows.Forms.DataGridViewTriState.False;
            this.colQuantity.Width = 30;
            // 
            // colRemove
            // 
            this.colRemove.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.None;
            this.colRemove.HeaderText = "Remove";
            this.colRemove.Name = "colRemove";
            this.colRemove.Text = "-";
            this.colRemove.ToolTipText = "Removes one of this recipe from your shopping cart";
            this.colRemove.UseColumnTextForButtonValue = true;
            this.colRemove.Width = 50;
            // 
            // colAdd
            // 
            this.colAdd.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.None;
            this.colAdd.HeaderText = "Add";
            this.colAdd.Name = "colAdd";
            this.colAdd.Text = "+";
            this.colAdd.ToolTipText = "Adds one of this recipe to your shopping cart";
            this.colAdd.UseColumnTextForButtonValue = true;
            this.colAdd.Width = 50;
            // 
            // colView
            // 
            this.colView.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.None;
            this.colView.HeaderText = "View";
            this.colView.Name = "colView";
            this.colView.Text = ". . .";
            this.colView.ToolTipText = "Click Here to View Ingredients";
            this.colView.UseColumnTextForButtonValue = true;
            this.colView.Width = 50;
            // 
            // MainForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.Black;
            this.ClientSize = new System.Drawing.Size(1000, 600);
            this.Controls.Add(this.btnRecipes);
            this.Controls.Add(this.pnlRecipes);
            this.Controls.Add(this.btnClose);
            this.Controls.Add(this.lblTitle);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "MainForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Cookbook";
            this.pnlRecipes.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.dgvRecipes)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Button btnClose;
        private System.Windows.Forms.Label lblTitle;
        private System.Windows.Forms.Panel pnlRecipes;
        private System.Windows.Forms.Button btnRecipes;
        private System.Windows.Forms.DataGridView dgvRecipes;
        private ucSearchBar ucSearchBar1;
        private System.Windows.Forms.DataGridViewTextBoxColumn colName;
        private System.Windows.Forms.DataGridViewTextBoxColumn colCategory;
        private System.Windows.Forms.DataGridViewTextBoxColumn colPrepTime;
        private System.Windows.Forms.DataGridViewTextBoxColumn colServings;
        private System.Windows.Forms.DataGridViewTextBoxColumn colCalories;
        private System.Windows.Forms.DataGridViewTextBoxColumn colQuantity;
        private System.Windows.Forms.DataGridViewButtonColumn colRemove;
        private System.Windows.Forms.DataGridViewButtonColumn colAdd;
        private System.Windows.Forms.DataGridViewButtonColumn colView;
    }
}

