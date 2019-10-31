/* eslint-disable @typescript-eslint/await-thenable */
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {TravelPreferences, Categories, User} from '../models';
import {
  TravelPreferencesRepository,
  CategoriesRepository,
} from '../repositories';
import {threadId} from 'worker_threads';

export class TravelPreferencesController {
  constructor(
    @repository(TravelPreferencesRepository)
    public travelPreferencesRepository: TravelPreferencesRepository,
    @repository(CategoriesRepository)
    public categoriesRepository: CategoriesRepository,
  ) {}

  @post('/travel-preferences', {
    responses: {
      '200': {
        description: 'TravelPreferences model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(TravelPreferences)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TravelPreferences, {exclude: ['id']}),
        },
      },
    })
    travelPreferences: Omit<TravelPreferences, 'id'>,
  ): Promise<any> {
    const travelData = await this.travelPreferencesRepository.create(
      travelPreferences,
    );
    let tid = '';
    tid = travelData.id;
    console.log('test1', travelData.id);
    travelData.userCheck = '1' + travelData.userId;
    await this.travelPreferencesRepository.updateById(
      travelData.id,
      travelData,
    );
    let finalList: Array<string> = [];
    const Business: Array<string> = ['Culinary'];
    const Vegan: Array<string> = ['Culinary'];
    const Shopping: Array<string> = ['Shopping', 'Culinary'];
    const allCategories: Array<string> = [
      'Shopping',
      'Culinary',
      'Adventure',
      'Museums',
      'Entertainment',
    ];
    const selectedData = travelPreferences.selectedTravelPreferences;
    // console.log(selectedData);
    selectedData.forEach((dataPreference: any) => {
      console.log('selected categories by surya', dataPreference);
      console.log('testdfdfd', dataPreference.name);
      if (
        dataPreference.name === 'Business' &&
        dataPreference.selected === true
      ) {
        console.log(dataPreference.name);
        finalList = finalList.concat(Business);
      }
      if (dataPreference.name === 'Vegan' && dataPreference.selected === true) {
        console.log(dataPreference.name);
        finalList = finalList.concat(Vegan);
      }
      if (
        dataPreference.name === 'Shopping' &&
        dataPreference.selected === true
      ) {
        console.log(dataPreference.name);
        finalList = finalList.concat(Shopping);
      }
      if (
        dataPreference.name === 'Local Experience' &&
        dataPreference.selected === true
      ) {
        console.log(dataPreference.name);
        finalList = finalList.concat(allCategories);
      }
      if (
        dataPreference.name === 'Travel on a budget' &&
        dataPreference.selected === true
      ) {
        console.log(dataPreference.name);
        finalList = finalList.concat(allCategories);
      }
      if (
        dataPreference.name === 'Solo Traveler' &&
        dataPreference.selected === true
      ) {
        console.log(dataPreference.name);
        finalList = finalList.concat(allCategories);
      }
      if (
        dataPreference.name === 'Family-oriented trendy' &&
        dataPreference.selected === true
      ) {
        console.log(dataPreference.name);
        finalList = finalList.concat(allCategories);
      }
    });

    console.log(finalList);

    const mainCategories = await this.categoriesRepository.find({
      where: {categoryname: {inq: finalList}},
    });

    const categoriesList: Array<object> = [];
    let i: any;
    for (i = 0; i < mainCategories.length; i++) {
      const subCategories = await this.categoriesRepository.find({
        where: {parentcategory: mainCategories[i].categoryname},
      });
      // console.log(subCategories, 'sub');
      categoriesList.push({
        id: mainCategories[i].id,
        categoryname: mainCategories[i].categoryname,
        subCategories: subCategories,
      });

      if (i === mainCategories.length - 1) {
        console.log('test2', tid);
        return {
          status: 'Success',
          id: tid,
          categoriesList,
        };
        // return {
        //   status: 'Success',
        // };
      }
    }
  }

  @get('/travel-preferences/count', {
    responses: {
      '200': {
        description: 'TravelPreferences model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(TravelPreferences))
    where?: Where<TravelPreferences>,
  ): Promise<Count> {
    return this.travelPreferencesRepository.count(where);
  }

  @get('/travel-preferences', {
    responses: {
      '200': {
        description: 'Array of TravelPreferences model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TravelPreferences),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(TravelPreferences))
    filter?: Filter<TravelPreferences>,
  ): Promise<TravelPreferences[]> {
    return this.travelPreferencesRepository.find(filter);
  }

  @post('/travel-preferences/userId', {
    responses: {
      '200': {
        description: 'TravelPreferences model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(User)},
        },
      },
    },
  })
  async findByUserId(@requestBody() body: any): Promise<TravelPreferences[]> {
    const userId = body.userId;
    const listPreferences = await this.travelPreferencesRepository.find(
      {
        where: {userId: userId},
      },
      {
        strictObjectIDCoercion: true,
      },
    );
    console.log(listPreferences);
    return listPreferences;
  }

  @post('/travel-preferences/update', {
    responses: {
      '200': {
        description: 'TravelPreferences model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(TravelPreferences)},
        },
      },
    },
  })
  async edit(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TravelPreferences),
        },
      },
    })
    travelPreferences: TravelPreferences,
  ): Promise<any> {
    const travelData = await this.travelPreferencesRepository.findById(
      travelPreferences.id,
    );
    // console.log('New Data : ', travelPreferences.selectedTravelPreferences);
    // console.log('Old data : ', travelData.selectedTravelPreferences);
    const Business: Array<string> = ['Culinary'];
    const Vegan: Array<string> = ['Culinary'];
    const Shopping: Array<string> = ['Shopping', 'Culinary'];
    const allCategories: Array<string> = [
      'Shopping',
      'Culinary',
      'Adventure',
      'Museums',
      'Entertainment',
    ];
    let oldPreferencesTypes: Array<string> = [];
    let newPreferencesTypes: Array<string> = [];
    const oldSelectedData = await travelData.selectedTravelPreferences;
    const newSelectedData = travelPreferences.selectedTravelPreferences;
    if (oldSelectedData) {
      oldSelectedData.forEach((oldDataPreference: any) => {
        if (
          oldDataPreference.name === 'Business' &&
          oldDataPreference.selected === true
        ) {
          oldPreferencesTypes = oldPreferencesTypes.concat(Business);
        }
        if (
          oldDataPreference.name === 'Vegan' &&
          oldDataPreference.selected === true
        ) {
          oldPreferencesTypes = oldPreferencesTypes.concat(Vegan);
        }
        if (
          oldDataPreference.name === 'Shopping' &&
          oldDataPreference.selected === true
        ) {
          oldPreferencesTypes = oldPreferencesTypes.concat(Shopping);
        }
        if (
          oldDataPreference.name === 'Local Experience' &&
          oldDataPreference.selected === true
        ) {
          oldPreferencesTypes = oldPreferencesTypes.concat(allCategories);
        }
        if (
          oldDataPreference.name === 'Travel on a budget' &&
          oldDataPreference.selected === true
        ) {
          oldPreferencesTypes = oldPreferencesTypes.concat(allCategories);
        }
        if (
          oldDataPreference.name === 'Solo Traveler' &&
          oldDataPreference.selected === true
        ) {
          oldPreferencesTypes = oldPreferencesTypes.concat(allCategories);
        }
        if (
          oldDataPreference.name === 'Family-oriented trendy' &&
          oldDataPreference.selected === true
        ) {
          oldPreferencesTypes = oldPreferencesTypes.concat(allCategories);
        }
      });
    }

    if (newSelectedData) {
      newSelectedData.forEach((newDataPreference: any) => {
        if (
          newDataPreference.name === 'Business' &&
          newDataPreference.selected === true
        ) {
          newPreferencesTypes = newPreferencesTypes.concat(Business);
        }
        if (
          newDataPreference.name === 'Vegan' &&
          newDataPreference.selected === true
        ) {
          newPreferencesTypes = newPreferencesTypes.concat(Vegan);
        }
        if (
          newDataPreference.name === 'Shopping' &&
          newDataPreference.selected === true
        ) {
          newPreferencesTypes = newPreferencesTypes.concat(Shopping);
        }
        if (
          newDataPreference.name === 'Local Experience' &&
          newDataPreference.selected === true
        ) {
          newPreferencesTypes = newPreferencesTypes.concat(allCategories);
        }
        if (
          newDataPreference.name === 'Travel on a budget' &&
          newDataPreference.selected === true
        ) {
          newPreferencesTypes = newPreferencesTypes.concat(allCategories);
        }
        if (
          newDataPreference.name === 'Solo Traveler' &&
          newDataPreference.selected === true
        ) {
          newPreferencesTypes = newPreferencesTypes.concat(allCategories);
        }
        if (
          newDataPreference.name === 'Family-oriented trendy' &&
          newDataPreference.selected === true
        ) {
          newPreferencesTypes = newPreferencesTypes.concat(allCategories);
        }
      });
    }

    console.log('New Data : ', newPreferencesTypes);
    console.log('Old data : ', oldPreferencesTypes);

    // eslint-disable-next-line prefer-const

    // console.log(travelData, 'data');
    const test: any = await travelPreferences.selectedTravelPreferences;
    console.log('test:', test);
    const array: any = await travelData.selectedTravelPreferences;
    // console.log(array, 'array');
    let i: any;
    if (array !== undefined) {
      console.log('failed');
    } else {
      console.log('sucess');
    }
    // let i:any
    // for(i=0;i<=array.length;i++)
    // let tid = '';
    // tid = travelData.id;
    // console.log('test1', travelData.id);
    // travelData.userCheck = '1' + travelData.userId;
    // await this.travelPreferencesRepository.updateById(
    //   travelData.id,
    //   travelData,
    // );
    // let finalList: Array<string> = [];
    // const Business: Array<string> = ['Culinary'];
    // const Vegan: Array<string> = ['Culinary'];
    // const Shopping: Array<string> = ['Shopping', 'Culinary'];
    // const allCategories: Array<string> = [
    //   'Shopping',
    //   'Culinary',
    //   'Adventure',
    //   'Museums',
    //   'Entertainment',
    // ];
    // const selectedData = travelPreferences.selectedTravelPreferences;
    // // console.log(selectedData);
    // selectedData.forEach((dataPreference: any) => {
    //   console.log('selected categories by surya', dataPreference);
    //   console.log('testdfdfd', dataPreference.name);
    //   if (
    //     dataPreference.name === 'Business' &&
    //     dataPreference.selected === true
    //   ) {
    //     console.log(dataPreference.name);
    //     finalList = finalList.concat(Business);
    //   }
    //   if (dataPreference.name === 'Vegan' && dataPreference.selected === true) {
    //     console.log(dataPreference.name);
    //     finalList = finalList.concat(Vegan);
    //   }
    //   if (
    //     dataPreference.name === 'Shopping' &&
    //     dataPreference.selected === true
    //   ) {
    //     console.log(dataPreference.name);
    //     finalList = finalList.concat(Shopping);
    //   }
    //   if (
    //     dataPreference.name === 'Local Experience' &&
    //     dataPreference.selected === true
    //   ) {
    //     console.log(dataPreference.name);
    //     finalList = finalList.concat(allCategories);
    //   }
    //   if (
    //     dataPreference.name === 'Travel on a budget' &&
    //     dataPreference.selected === true
    //   ) {
    //     console.log(dataPreference.name);
    //     finalList = finalList.concat(allCategories);
    //   }
    //   if (
    //     dataPreference.name === 'Solo Traveler' &&
    //     dataPreference.selected === true
    //   ) {
    //     console.log(dataPreference.name);
    //     finalList = finalList.concat(allCategories);
    //   }
    //   if (
    //     dataPreference.name === 'Family-oriented trendy' &&
    //     dataPreference.selected === true
    //   ) {
    //     console.log(dataPreference.name);
    //     finalList = finalList.concat(allCategories);
    //   }
    // });

    // console.log(finalList);

    // const mainCategories = await this.categoriesRepository.find({
    //   where: {categoryname: {inq: finalList}},
    // });

    // const categoriesList: Array<object> = [];
    // let i: any;
    // for (i = 0; i < mainCategories.length; i++) {
    //   const subCategories = await this.categoriesRepository.find({
    //     where: {parentcategory: mainCategories[i].categoryname},
    //   });
    //   // console.log(subCategories, 'sub');
    //   categoriesList.push({
    //     id: mainCategories[i].id,
    //     categoryname: mainCategories[i].categoryname,
    //     subCategories: subCategories,
    //   });

    //   if (i === mainCategories.length - 1) {
    //     console.log('test2', tid);
    //     return {
    //       status: 'Success',
    //       id: tid,
    //       categoriesList,
    //     };
    //     // return {
    //     //   status: 'Success',
    //     // };
    //   }
    // }
  }

  @patch('/travel-preferences', {
    responses: {
      '200': {
        description: 'TravelPreferences PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TravelPreferences, {partial: true}),
        },
      },
    })
    travelPreferences: TravelPreferences,
    @param.query.object('where', getWhereSchemaFor(TravelPreferences))
    where?: Where<TravelPreferences>,
  ): Promise<Count> {
    return this.travelPreferencesRepository.updateAll(travelPreferences, where);
  }

  @get('/travel-preferences/{id}', {
    responses: {
      '200': {
        description: 'TravelPreferences model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(TravelPreferences)},
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
  ): Promise<TravelPreferences> {
    return this.travelPreferencesRepository.findById(id);
  }

  @patch('/travel-preferences/{id}', {
    responses: {
      '204': {
        description: 'TravelPreferences PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TravelPreferences, {partial: true}),
        },
      },
    })
    travelPreferences: TravelPreferences,
  ): Promise<object> {
    await this.travelPreferencesRepository.updateById(id, travelPreferences);
    const updatedData = await this.travelPreferencesRepository.findById(id);
    // console.log(checkUser, '5d9ab8211113661189ffb735');
    console.log(updatedData, 'updateddata');
    // console.log(updatedUser, 'userupdated');

    return {
      status: 'success',
      message: 'successfully Updated',
      data: updatedData,
    };
  }

  @put('/travel-preferences/{id}', {
    responses: {
      '204': {
        description: 'TravelPreferences PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() travelPreferences: TravelPreferences,
  ): Promise<void> {
    await this.travelPreferencesRepository.replaceById(id, travelPreferences);
  }

  @del('/travel-preferences/{id}', {
    responses: {
      '204': {
        description: 'TravelPreferences DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.travelPreferencesRepository.deleteById(id);
  }

  @post('/budget-info', {
    responses: {
      '200': {
        description: 'Array of Admin model instances',
        headers: {
          'content-type': 'application/json',
        },
      },
    },
  })
  async budgetInfo(@requestBody() body: any): Promise<any> {
    // const value = data;
    const data = await this.travelPreferencesRepository.findById(body.id);
    // const budgetPerDay = data.totalBudget / data.daysCount;

    let totalBudget: any;
    let daysCount: any;
    let totalExpen: any;

    // eslint-disable-next-line prefer-const
    if (data.expenditure === 0) {
      totalBudget = data.totalBudget;
      // eslint-disable-next-line prefer-const
      totalExpen = data.expenditure;
      const remaingBudget = totalBudget - totalExpen;
      // eslint-disable-next-line prefer-const
      daysCount = data.daysCount;
      const budgetPerDay = remaingBudget / daysCount;
      console.log(budgetPerDay, 'budget');
      const budgetDivide = budgetPerDay / 2;
      console.log('budgetDivide', budgetDivide);
    }
  }
}
