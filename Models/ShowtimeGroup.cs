using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactCinema.Models
{
    public class ShowtimeGroup
    {
        public int ShowtimeGroupID { get; set; }
        public int MovieID { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }

        public virtual Movie Movie { get; set; }
        public virtual ICollection<ShowtimeGroupEntry> ShowtimeGroupEntries { get; set; }
    }
}
