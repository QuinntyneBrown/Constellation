using Constellation.Data;
using Constellation.Data.Repositories;
using Constellation.Services;
using Constellation.Services.Interfaces;
using Constellation.Services.Sources;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// EF Core with SQL Server
builder.Services.AddDbContext<ConstellationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Mining options
builder.Services.Configure<MiningOptions>(builder.Configuration.GetSection(MiningOptions.SectionName));
builder.Services.PostConfigure<MiningOptions>(options => options.ApplyDefaults());

// Repositories
builder.Services.AddScoped<IEventRepository, EventRepository>();

// Event sources
builder.Services.AddSingleton<IEventSource, EventbriteEventSource>();
builder.Services.AddSingleton<IEventSource, MeetupEventSource>();
builder.Services.AddSingleton<IEventSource, WebSearchEventSource>();

// Background service
builder.Services.AddHostedService<MiningBackgroundService>();

// HttpClient
builder.Services.AddHttpClient();

// Health checks
builder.Services.AddHealthChecks();

// Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/healthz");

app.Run();
