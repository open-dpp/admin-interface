import RepeatableSectionForm from "./RepeatableSectionForm.vue";

describe("<RepeatableSectionForm />", () => {
  it("renders rows", () => {
    const section = {
      id: "s1",
      name: "Technische Spezifikation",
      dataFields: [
        {
          id: "f1",
          type: "TextField",
          name: "Feld 1",
        },
        {
          id: "f2",
          type: "TextField",
          name: "Feld 2",
        },
      ],
    };

    const dataValues = [
      {
        id: "i1",
        dataSectionId: "s1",
        dataFieldId: "f1",
        value: "val1 row 0",
        row: 0,
      },
      {
        id: "i2",
        dataSectionId: "s1",
        dataFieldId: "f1",
        value: "val1 row 1",
        row: 1,
      },
      {
        id: "i3",
        dataSectionId: "s1",
        dataFieldId: "f2",
        value: "val2 row 0",
        row: 0,
      },
      {
        id: "i4",
        dataSectionId: "s1",
        dataFieldId: "f2",
        value: "val2 row 1",
        row: 1,
      },
    ];
    cy.mountWithPinia(RepeatableSectionForm, {
      props: { section, dataValues },
    });
    cy.contains(`Abschnitt ${section.name}`).should("be.visible");
  });
});
