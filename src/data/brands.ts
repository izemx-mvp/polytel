export interface Brand {
  slug: string;
  name: string;
  logo: string;
}

export const brands: Brand[] = [
  {
    slug: "brother",
    name: "Brother",
    logo: "https://www.polytel.ma/uploads/8351dc51128479e9bb7bc48603b0ac3b.png",
  },
  {
    slug: "sharp",
    name: "Sharp",
    logo: "https://www.polytel.ma/uploads/13f3611ebb82ca907a827ca723d4368e.png",
  },
  {
    slug: "evolis",
    name: "Evolis",
    logo: "https://www.polytel.ma/uploads/43eab5baa5ec3c756ba4b77c4d0e2d01.jpeg",
  },
  {
    slug: "olympia",
    name: "Olympia",
    logo: "https://www.polytel.ma/uploads/930cedd26ced88327b0d822973e69af6.png",
  },
  {
    slug: "hp",
    name: "HP",
    logo: "https://www.polytel.ma/uploads/00ec7959940a8bbd0a6b79059b67864e.jpeg",
  },
  {
    slug: "zebra",
    name: "Zebra",
    logo: "https://www.polytel.ma/uploads/5e137a0219f6f754909d7c1e5bc9d3ef.png",
  },
  {
    slug: "honeywell",
    name: "Honeywell",
    logo: "https://www.polytel.ma/uploads/635a8fc75b92e3a3df2949393f84c9dc.png",
  },
  {
    slug: "alfa",
    name: "Alfa",
    logo: "https://www.polytel.ma/uploads/1592f05d569d5afa4ef89bcda0d29130.png",
  },
  {
    slug: "salicru",
    name: "Salicru",
    logo: "https://www.polytel.ma/uploads/57ea946bd00ddda30fa3d29bc35a83b4.jpeg",
  },
  {
    slug: "videojet",
    name: "Videojet",
    logo: "https://www.polytel.ma/uploads/a57951462e569661770bd4ef2fba2c24.png",
  },
  {
    slug: "sato",
    name: "SATO",
    logo: "https://www.polytel.ma/uploads/2e4204cfa87deef3dc58857a3e24423f.png",
  },
];

export const getBrand = (slug: string) => brands.find((b) => b.slug === slug);
