using System;

namespace Persistence.Helpers
{
    public class CarParams
    {
        private const int maxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int pageSize = 10;
        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = (value >= maxPageSize) ? maxPageSize : value; }
        }
        public string BrandName { get; set; }
        public string ModelName { get; set; }
        public int MinPrice { get; set; } = 0;
        public int MaxPrice { get; set; } = 10000000;
        public int MinYear { get; set; } = 1900;
        public int MaxYear { get; set; } = DateTime.Now.Year;
        public string OrderBy { get; set; }
        public double EnginePower { get; set; }
        public string Fuel { get; set; }
        public string Body { get; set; }
        public string Color { get; set; }
        public string Transmission { get; set; }
        public string Drive { get; set; }
        public string IsNew { get; set; }
        public int Odometr { get; set; }
    }
}