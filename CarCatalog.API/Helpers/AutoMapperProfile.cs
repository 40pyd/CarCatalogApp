using System.Linq;
using AutoMapper;
using Domain;
using Persistence.Dtos;

namespace CarCatalog.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>()
                .ForMember(dest => dest.PhotoUrl,
                    opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url));
            CreateMap<User, UserForDetailedDto>()
                .ForMember(dest => dest.PhotoUrl,
                    opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url));
            CreateMap<Photo, PhotoForDetailedDto>();
            // CreateMap<Photo, PhotoForReturnDto>();
            // CreateMap<PhotoForCreationDto, Photo>();
            // CreateMap<UserForUpdateDto, User>();
            CreateMap<UserForRegisterDto, User>();
            // CreateMap<MessageForCreationDto, Message>().ReverseMap();
            // CreateMap<Message, MessageToReturnDto>()
            //     .ForMember(dest => dest.SenderPhotoUrl,
            //         opt => opt.MapFrom(src => src.Sender.Photos.FirstOrDefault(p => p.IsMain).Url))
            //     .ForMember(dest => dest.RecipientPhotoUrl,
            //         opt => opt.MapFrom(src => src.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url));
        }
    }
}