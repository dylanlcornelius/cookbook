using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MealPlanner
{
    public partial class ucSearchBar : UserControl
    {
        DataTable dataTable;

        public ucSearchBar()
        {
            InitializeComponent();

            dataTable = null;
        }

        public void LoadDataSource(DataTable dataTable)
        {
            this.dataTable = dataTable;
        }

        private void tbxSearch_TextChanged(object sender, EventArgs e)
        {
            string filterValue = tbxSearch.Text;

            string rowFilter = "[" + dataTable.Columns[0].ColumnName + "] = '{" + filterValue + "}'";

            for (int i = 1; i < dataTable.Columns.Count; i++)
            {
                rowFilter += "OR [" + dataTable.Columns[i].ColumnName + "] = '{" + filterValue + "}'";
            }

            dataTable.DefaultView.RowFilter = rowFilter;
        }

        private void btnClear_Click(object sender, EventArgs e)
        {
            tbxSearch.Text = "";
        }
    }
}
