using ServiceData.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace MvcApplication1.Controllers.API
{
    public class ServiceRequestController : ApiController
    {

        public HttpResponseMessage Get()
        {
            HttpResponseMessage response = new HttpResponseMessage();
            List<ProblemData> ProblemDatas = new ProblemDataContext().ProblemDatas.ToList<ProblemData>();
            response = Request.CreateResponse(HttpStatusCode.OK, ProblemDatas);
            return response;
        }

        public HttpResponseMessage Post(ProblemData problemData)
        {
            HttpResponseMessage response = new HttpResponseMessage();
            problemData.ID = Guid.NewGuid();
            problemData.CreatedDate = DateTime.Now;
            using (var dbContext = new ProblemDataContext())
            {
                dbContext.ProblemDatas.Add(problemData);               
                int result = dbContext.SaveChanges();
            }
            response = Request.CreateResponse<ProblemData>(HttpStatusCode.OK, problemData);
            return response;
        }

    }
}
