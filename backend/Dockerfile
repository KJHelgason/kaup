FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Kaup.Api/Kaup.Api.csproj", "Kaup.Api/"]
RUN dotnet restore "Kaup.Api/Kaup.Api.csproj"
COPY . .
WORKDIR "/src/Kaup.Api"
RUN dotnet build "Kaup.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Kaup.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Kaup.Api.dll"]