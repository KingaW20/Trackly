using Trackly.Models;
using Trackly.Repositories;
using Trackly.Utils.Exceptions;

namespace Trackly.Services
{
    public class ImageService
    {
        private readonly ImageRepository _imgRepository;

        public ImageService(ImageRepository imageRepository)
        {
            _imgRepository = imageRepository;
        }

        public async Task<IEnumerable<Image>> GetImages()
        {
            var result = await _imgRepository.GetImages();
            foreach (var img in result)
                img.Source = "data:image/" + img.FileExtension + ";base64," + Convert.ToBase64String(img.Bytes);
            return result;
        }

        public async Task<Image?> GetImage(int? id)
        {
            var result = await _imgRepository.GetImage(id);
            if (result == null) throw new NotFoundException();
            result.Source = "data:image/" + result.FileExtension + ";base64," + Convert.ToBase64String(result.Bytes);
            return result;
        }

        public async Task<Image> AddImage(Image image)
        {
            image.Id = 0;
            return await _imgRepository.AddImage(image);
        }
    }
}
