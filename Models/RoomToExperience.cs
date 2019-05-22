using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactCinema.Models
{
    public class RoomToExperience
    {
        public int RoomID { get; set; }
        public int ExperienceID { get; set; }

        public virtual Room Room { get; set; }
        public virtual Experience Experience { get; set; }
    }
}
