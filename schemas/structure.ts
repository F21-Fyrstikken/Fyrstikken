import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (s) =>
  s
    .list()
    .title("Content")
    .items([
      // Years list with nested categories and projects
      s
        .listItem()
        .title("Years")
        .child(
          s
            .documentTypeList("year")
            .title("Years")
            .child((yearId) =>
              s
                .list()
                .title("Year Details")
                .items([
                  // Edit the year document
                  s.listItem().title("Edit Year").child(s.document().schemaType("year").documentId(yearId)),
                  // Divider
                  s.divider(),
                  // Categories for this year
                  s
                    .listItem()
                    .title("Categories")
                    .child(
                      s
                        .documentList()
                        .title("Categories")
                        .filter('_type == "category" && year._ref == $yearId')
                        .params({ yearId })
                        .child((categoryId) =>
                          s
                            .list()
                            .title("Category Details")
                            .items([
                              // Edit the category document
                              s
                                .listItem()
                                .title("Edit Category")
                                .child(s.document().schemaType("category").documentId(categoryId)),
                              // Divider
                              s.divider(),
                              // Projects for this category
                              s
                                .listItem()
                                .title("Projects")
                                .child(
                                  s
                                    .documentList()
                                    .title("Projects")
                                    .filter('_type == "project" && category._ref == $categoryId')
                                    .params({ categoryId })
                                ),
                            ])
                        )
                    ),
                ])
            )
        ),
      // Divider
      s.divider(),
      // Flat lists for quick access
      s.listItem().title("All Categories").child(s.documentTypeList("category").title("All Categories")),
      s.listItem().title("All Projects").child(s.documentTypeList("project").title("All Projects")),
    ]);
