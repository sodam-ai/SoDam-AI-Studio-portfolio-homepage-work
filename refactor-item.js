const fs = require("fs");
const path =
  "f:/Study/Dev/2026y/26y_02m_22d_personal-portfolio/src/components/features/admin/AdminProjectItem.tsx";
let content = fs.readFileSync(path, "utf8");

// Add import
content = content.replace(
  'import { MediaUploadInput } from "./MediaUploadInput";',
  'import { MediaUploadInput } from "./MediaUploadInput";\nimport { AdminMediaUploader } from "./AdminMediaUploader";',
);

// 1. Thumbnail
const thumbRegex =
  /<MediaUploadInput[\s\S]*?id={`thumbnail-\${project\.id}`}[\s\S]*?<\/select>\s+<\/div>/;
content = content.replace(
  thumbRegex,
  `<AdminMediaUploader
                    id={\`thumbnail-\${project.id}\`}
                    type="thumbnail"
                    label="Thumbnail URL"
                    value={project.thumbnail}
                    onUrlChange={(val) => handleUpdate(index, "thumbnail", val)}
                    onFileUpload={(e) => handleFileUpload(index, e, "thumbnail")}
                    isUploading={isUploading === project.id}
                    aspectRatio={project.aspectRatio}
                    onAspectRatioChange={(val) => handleUpdate(index, "aspectRatio", val)}
                    placeholder="/images/..."
                  />`,
);

// 2. External Connections
const extConnRegex =
  /<MediaUploadInput[\s\S]*?id={`liveUrl-\${project\.id}`}[\s\S]*?id={`githubUrl-\${project\.id}`}[\s\S]*?placeholder="https:\/\/github\.com\/\.\.\."\s+\/>/;
content = content.replace(
  extConnRegex,
  `<AdminMediaUploader
                  type="live"
                  id={\`liveUrl-\${project.id}\`}
                  label="Live URL"
                  value={project.liveUrl || ""}
                  onUrlChange={(val) => handleUpdate(index, "liveUrl", val)}
                  onFileUpload={(e) => handleFileUpload(index, e, "asset", "liveUrl")}
                  isUploading={isUploading === "liveUrl-" + project.id}
                  placeholder="https://..."
                />
                <AdminMediaUploader
                  type="github"
                  id={\`githubUrl-\${project.id}\`}
                  label="GitHub Repository"
                  value={project.githubUrl || ""}
                  onUrlChange={(val) => handleUpdate(index, "githubUrl", val)}
                  onFileUpload={(e) => handleFileUpload(index, e, "asset", "githubUrl")}
                  isUploading={isUploading === "githubUrl-" + project.id}
                  placeholder="https://github.com/..."
                />`,
);

// 3. Video
const videoRegex =
  /<div className="space-y-2">\s+<label[\s\S]*?id={`videoUrl-\${project\.id}`}[\s\S]*?<\/div>/;
content = content.replace(
  videoRegex,
  `<AdminMediaUploader
                  type="video"
                  id={\`videoUrl-\${project.id}\`}
                  label="Video Embed URL"
                  value={project.videoUrl || ""}
                  onUrlChange={(val) => handleUpdate(index, "videoUrl", val)}
                  onFileUpload={(e) => handleFileUpload(index, e, "video")}
                  isUploading={isUploading === "video-" + project.id}
                  aspectRatio={project.aspectRatio}
                  placeholder="https://..."
                />`,
);

// 4. Result file
const resultRegex =
  /<MediaUploadInput[\s\S]*?id={`resultFileUrl-\${project\.id}`}[\s\S]*?placeholder="\/assets\/projects\/\.\.\."\s+\/>/;
content = content.replace(
  resultRegex,
  `<AdminMediaUploader
                    type="asset"
                    id={\`resultFileUrl-\${project.id}\`}
                    label="Result File (Program/Doc)"
                    value={project.resultFileUrl || ""}
                    onUrlChange={(val) => handleUpdate(index, "resultFileUrl", val)}
                    onFileUpload={(e) => handleFileUpload(index, e, "asset", "resultFileUrl")}
                    isUploading={isUploading === "resultFileUrl-" + project.id}
                    placeholder="/assets/projects/..."
                  />`,
);

// 5. Gallery images
const galleryRegex =
  /<div className="space-y-2">\s+<div className="flex justify-between items-end mb-1">[\s\S]*?id={`images-\${project\.id}`}[\s\S]*?<\/div>/;
content = content.replace(
  galleryRegex,
  `<AdminMediaUploader
                type="gallery"
                id={\`images-\${project.id}\`}
                label="Gallery Images (One per line)"
                value={project.images}
                onUrlChange={(val) => handleListUpdate(index, "images", val)}
                onFileUpload={(e) => handleFileUpload(index, e, "gallery")}
                isUploading={isUploading === "gallery-" + project.id}
              />`,
);

fs.writeFileSync(path, content, "utf8");
console.log("Successfully updated AdminProjectItem.tsx");
