using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactCinema.Models
{
    public class Layout
    {
        public int LayoutID { get; set; }
        public string Title { get; set; }
        public int ColumnCount { get; set; }

        public virtual ICollection<Room> Rooms { get; set; }
        public virtual ICollection<Row> Rows { get; set; }

    }
}
