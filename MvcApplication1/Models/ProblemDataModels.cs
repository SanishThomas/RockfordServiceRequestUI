using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace ServiceData.Models
{
    public class ProblemDataContext : DbContext
    {
        public DbSet<ProblemData> ProblemDatas { get; set; }
    }

    [Table("ProblemData")]
    public class ProblemData
    {
        [Key]
        public Guid ID { get; set; }
        public decimal Latitude { get; set; }
        public string Longitude { get; set; }
        public string Description { get; set; }
        public string Severity { get; set; }
        public string ServiceType { get; set; }
        public string ImageUrl { get; set; }
        public string VideoUrl { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}