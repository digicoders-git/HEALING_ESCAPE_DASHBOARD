import Profile from "../pages/Profile";
import Speciality from "../pages/Speciality";
import AddSpeciality from "../pages/AddSpeciality";
import EditSpeciality from "../pages/EditSpeciality";
import ViewSpeciality from "../pages/ViewSpeciality";
import Hospital from "../pages/Hospital";
import AddHospital from "../pages/AddHospital";
import EditHospital from "../pages/EditHospital";
import ViewHospital from "../pages/ViewHospital";
import Doctor from "../pages/Doctor";
import AddDoctor from "../pages/AddDoctor";
import EditDoctor from "../pages/EditDoctor";
import ViewDoctor from "../pages/ViewDoctor";
import Blog from "../pages/Blog";
import AddBlog from "../pages/AddBlog";
import EditBlog from "../pages/EditBlog";
import ViewBlog from "../pages/ViewBlog";
import Gallery from "../pages/Gallery";
import AddGallery from "../pages/AddGallery";
import EditGallery from "../pages/EditGallery";
import ViewGallery from "../pages/ViewGallery";
import Video from "../pages/Video";
import AddVideo from "../pages/AddVideo";
import EditVideo from "../pages/EditVideo";
import ViewVideo from "../pages/ViewVideo";
import FreeConsultation from "../pages/FreeConsultation";
import EditFreeConsultation from "../pages/EditFreeConsultation";
import ViewFreeConsultation from "../pages/ViewFreeConsultation";
import Enquiry from "../pages/Enquiry";
import EditEnquiry from "../pages/EditEnquiry";
import ViewEnquiry from "../pages/ViewEnquiry";

export const AppRoute = [
  { path: "profile", component: Profile },
  { path: "speciality", component: Speciality },
  { path: "speciality/add", component: AddSpeciality },
  { path: "speciality/edit/:id", component: EditSpeciality },
  { path: "speciality/view/:id", component: ViewSpeciality },
  { path: "hospital", component: Hospital },
  { path: "hospital/add", component: AddHospital },
  { path: "hospital/edit/:id", component: EditHospital },
  { path: "hospital/view/:id", component: ViewHospital },
  { path: "doctor", component: Doctor },
  { path: "doctor/add", component: AddDoctor },
  { path: "doctor/edit/:id", component: EditDoctor },
  { path: "doctor/view/:id", component: ViewDoctor },
  { path: "blog", component: Blog },
  { path: "blog/add", component: AddBlog },
  { path: "blog/edit/:id", component: EditBlog },
  { path: "blog/view/:id", component: ViewBlog },
  { path: "gallery", component: Gallery },
  { path: "gallery/add", component: AddGallery },
  { path: "gallery/edit/:id", component: EditGallery },
  { path: "gallery/view/:id", component: ViewGallery },
  { path: "video", component: Video },
  { path: "video/add", component: AddVideo },
  { path: "video/edit/:id", component: EditVideo },
  { path: "video/view/:id", component: ViewVideo },
  { path: "free-consultation", component: FreeConsultation },
  { path: "free-consultation/edit/:id", component: EditFreeConsultation },
  { path: "free-consultation/view/:id", component: ViewFreeConsultation },
  { path: "enquiry", component: Enquiry },
  { path: "enquiry/edit/:id", component: EditEnquiry },
  { path: "enquiry/view/:id", component: ViewEnquiry },
];
