import { HttpException, UnprocessableEntityException } from '@nestjs/common';
import { User } from 'src/api/user/entities/user.entity';
import { BaseCustomRepository } from '../../../common/db/customBaseRepository/BaseCustomRepository';
import { CustomRepository } from '../../../common/db/decorators/CustomRepository.decorator';
import { CreateProjectDto } from '../dtos/create-project.dto';
import { UpdateProjectDto } from '../dtos/update-project.dto';
import { Project } from '../entities/project.entity';
import { IProjectRepository } from '../interfaces/project.interface';


@CustomRepository(Project)
export class ProjectRepository
  extends BaseCustomRepository<Project>
  implements IProjectRepository
{
  async getProject(): Promise<Project[]> {
    return await this.find();
  }

  async createProject(createProjectDto : CreateProjectDto) : Promise<Project>{
    const project = this.create(createProjectDto);
    await this.save(project);

    return project
  }

  async getProjectById(projectId:string):Promise<Project>{
    const project = await this.findOneBy({uuid : projectId})
         if (!project) {
        throw new UnprocessableEntityException('This project does not exist!');
        }
        return project;
  }

  async updateProject(id:string, data: UpdateProjectDto) :Promise<Project>{

    const project = this.getProjectById(id);

    if(!project){
        throw new HttpException('Project does not exist',404);
    }
    await this.update({uuid:id},data)
    const updated = this.getProjectById(id);

    return updated;
  }

  async addUserToProject(projectId:string, userId: string) :Promise<void>{
    const project = await this.getProjectById(projectId)
    const user = await this.manager.findOne(User, { where :{uuid: userId}})

    project.users = [user]
    await this.save(project);
  }
    //   // if project.users is not iterable, create a new array to hold users
    //   project.users = [user]
    // } else {
    //   project.users.push(user)
    // }
  


  async removeProject(projectId: string): Promise<void> {
    const project = await this.findOneBy({uuid:projectId})
    await this.delete(project.id);
  }
}