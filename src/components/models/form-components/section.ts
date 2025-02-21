import {
  DataValueCreateDto,
  DataValueDto,
  DataValuePatchDto,
  SectionDto,
} from "@open-dpp/api-client";
import { groupBy, maxBy, merge, minBy, pick } from "lodash";
import { v4 as uuid4 } from "uuid";
import apiClient from "../../../lib/api-client";

export type RequestDataValues = {
  POST?: DataValueCreateDto[];
  PATCH?: DataValuePatchDto[];
};

type Row = {
  type: string;
  id?: string;
  name?: string;
  label: string;
  validation: string;
};

export class RepeatableSectionBuilder {
  private rows: Row[];
  private minRow = 0;
  private maxRow = 0;
  private dataValues: DataValueDto[];
  private dataValuesToCreate: string[] = [];
  private section: SectionDto;
  constructor(
    private modelId: string,
    dataValues: DataValueDto[],
    section: SectionDto,
  ) {
    this.dataValues = dataValues;
    this.section = section;
    this.minRow = minBy(dataValues, "row")?.row ?? 0;
    this.maxRow = maxBy(dataValues, "row")?.row ?? 0;
    this.rows = this.maxRow === 0 ? [] : this.createRows(dataValues, section);
  }

  createRows(dataValues: DataValueDto[], section: SectionDto) {
    const dataValuesByRow = groupBy(dataValues, "row");
    const rows = [];
    for (let i = this.minRow; i <= this.maxRow; i++) {
      rows.push(
        ...section.dataFields.map((dataField) => {
          const dataValue = dataValuesByRow[i].find(
            (v) => v.dataFieldId === dataField.id,
          );
          return {
            type: dataField.type,
            id: dataValue?.id,
            name: dataValue?.id,
            label: dataField.name,
            validation: "required",
          };
        }),
      );
    }
    return rows;
  }

  async addRow() {
    const newRow: Row[] = [];
    this.maxRow += 1;
    // this.section.dataFields.forEach((f) => {
    //   const dataValueId = uuid4();
    //   this.dataValuesToCreate.push(dataValueId);
    //
    //   this.dataValues.push({
    //     id: dataValueId,
    //     value: undefined,
    //     dataSectionId: this.section.id,
    //     dataFieldId: f.id,
    //     row: this.maxRow,
    //   });
    //   newRow.push({
    //     type: f.type,
    //     id: dataValueId,
    //     name: dataValueId,
    //     label: f.name,
    //     validation: "required",
    //   });
    // });
    const dataValuesToCreate = this.section.dataFields.map((f) => ({
      value: undefined,
      dataSectionId: this.section.id,
      dataFieldId: f.id,
      row: this.maxRow,
    }));
    const response = await apiClient.models.addModelData(
      this.modelId,
      dataValuesToCreate,
    );
    const createdDataValues = response.data.dataValues.filter(
      (d) => d.dataSectionId === this.section.id && d.row === this.maxRow,
    );

    this.dataValues.push(...createdDataValues);

    this.rows.push(
      ...createdDataValues.map((d) => ({
        type: "TextField",
        id: d.id,
        name: d.id,
        label: d.id,
        validation: "required",
      })),
    );
    return this;
  }

  updateDataValues(formData: Record<string, unknown>) {
    merge(
      this.dataValues,
      Object.entries(formData).map(([id, value]) => ({ id, value })),
    );
    return this;
  }

  buildRequestValues(): RequestDataValues {
    const dataValuesForPost = this.dataValues
      .filter((d) => this.dataValuesToCreate.includes(d.id))
      .map((d) => ({
        row: d.row!,
        value: d.value,
        dataSectionId: d.dataSectionId,
        dataFieldId: d.dataFieldId,
      }));
    const dataValuesForPatch = this.dataValues
      .filter((d) => !this.dataValuesToCreate.includes(d.id))
      .map((d) => pick(d, ["id", "value"]));
    return {
      POST: dataValuesForPost,
      PATCH: dataValuesForPatch,
    };
  }

  buildFormData(): Record<string, unknown> {
    return Object.fromEntries(this.dataValues.map((d) => [d.id, d.value]));
  }

  buildFormRows() {
    return this.rows.map((r) => ({
      $cmp: r.type,

      props: {
        id: r.id,
        name: r.name,
      },
    }));
  }
}
