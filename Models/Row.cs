using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactCinema.Models
{
    public class Row
    {
        public int RowID { get; set; }
        public int LayoutID { get; set; }
        public string Label { get; set; }

        public virtual Layout Layout { get; set; }
        public virtual ICollection<Seat> Seats { get; set; }
    }
}
