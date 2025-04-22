
package com.ra.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class CloudinaryService {
    @Autowired
    private Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) {
        if (file != null && !file.isEmpty()) {
            String originalFileName = file.getOriginalFilename();
            if (originalFileName != null && originalFileName.contains(".")) {
                originalFileName = originalFileName.substring(0, originalFileName.lastIndexOf("."));
            }
            Map<String, Object> uploadParams = ObjectUtils.asMap(
                    "public_id", originalFileName
            );
            try {
                Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
                return uploadResult.get("url").toString();
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload file to Cloudinary", e);
            }
        }
        return null;
    }

    public List<String> uploadFiles(List<MultipartFile> files) {
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            String url = uploadFile(file);
            if (url != null) {
                urls.add(url);
            }
        }
        return urls;
    }
}